import LocaleSelector from 'c/localeSelector';
import getLocaleOptions from '@salesforce/apex/LocaleSelectorController.getLocaleOptions';
import updateUserLocale from '@salesforce/apex/LocaleSelectorController.updateUserLocale';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_LOCALE from '@salesforce/i18n/locale';

// Mock the Apex methods
jest.mock(
	'@salesforce/apex/LocaleSelectorController.getLocaleOptions',
	() => ({
		default: jest.fn()
	}),
	{ virtual: true }
);

jest.mock(
	'@salesforce/apex/LocaleSelectorController.updateUserLocale',
	() => ({
		default: jest.fn()
	}),
	{ virtual: true }
);

// Utility function to wait for asynchronous DOM updates
function flushPromises() {
	return new Promise((resolve) => setImmediate(resolve));
}

describe('c-locale-selector', () => {
	const mockLocaleOptions = [
		{
			localeCode: 'en_US',
			browserLocale: 'en-US',
			dateFormat: 'MM/DD/YYYY',
			numberFormat: '1,234.56',
			timeFormat: 'hh:mm a',
			displayLabel: '(MM/DD/YYYY | 1,234.56 | hh:mm a)'
		},
		{
			localeCode: 'fr_FR',
			browserLocale: 'fr-FR',
			dateFormat: 'DD/MM/YYYY',
			numberFormat: '1 234,56',
			timeFormat: 'HH:mm',
			displayLabel: '(DD/MM/YYYY | 1 234,56 | HH:mm)'
		}
	];

	beforeEach(() => {
		// Mock USER_LOCALE
		jest.mock('@salesforce/i18n/locale', () => ({ default: 'en-US' }), { virtual: true });
	});

	// Reset the DOM and mocks after each test
	afterEach(() => {
		// Clear the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
		// Clear all mock data
		jest.clearAllMocks();
	});

	it('renders combobox with locale options', async () => {
		// Arrange
		const element = createElement('c-locale-selector', {
			is: LocaleSelector
		});

		// Mock data returned by getLocaleOptions
		const mockLocaleOptions = [
			{
				localeCode: 'en_US',
				dateFormat: 'MM/DD/YYYY',
				numberFormat: '1,234.56',
				timeFormat: 'hh:mm a',
				displayLabel: 'Date: MM/DD/YYYY | Number: 1,234.56 | Time: hh:mm a'
			},
			{
				localeCode: 'en_GB',
				dateFormat: 'DD/MM/YYYY',
				numberFormat: '1,234.56',
				timeFormat: 'HH:mm',
				displayLabel: 'Date: DD/MM/YYYY | Number: 1,234.56 | Time: HH:mm'
			}
			// Add more mock options as needed
		];
		getLocaleOptions.mockResolvedValue(mockLocaleOptions);

		// Act
		document.body.appendChild(element);

		// Wait for any asynchronous DOM updates
		await flushPromises();

		// Assert
		const combobox = element.shadowRoot.querySelector('lightning-combobox');
		expect(combobox).not.toBeNull();
		expect(combobox.options.length).toBe(mockLocaleOptions.length);
		// Verify that combobox options match the mock data
		expect(combobox.options[0].label).toBe(mockLocaleOptions[0].displayLabel);
		expect(combobox.options[0].value).toBe(mockLocaleOptions[0].localeCode);
	});

	it('updates user locale on selection change and shows success toast', async () => {
		// Arrange
		const element = createElement('c-locale-selector', {
			is: LocaleSelector
		});

		// Mock data and methods
		const mockLocaleOptions = [
			{
				localeCode: 'en_US',
				dateFormat: 'MM/DD/YYYY',
				numberFormat: '1,234.56',
				timeFormat: 'hh:mm a',
				displayLabel: 'Date: MM/DD/YYYY | Number: 1,234.56 | Time: hh:mm a'
			}
		];
		getLocaleOptions.mockResolvedValue(mockLocaleOptions);
		updateUserLocale.mockResolvedValue();

		// Mock window.location.reload to prevent actual reload during test
		delete window.location;
		window.location = { reload: jest.fn() };

		// Spy on dispatchEvent to capture ShowToastEvent
		const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');

		// Act
		document.body.appendChild(element);

		// Wait for asynchronous DOM updates
		await flushPromises();

		// Simulate user selecting a locale
		const combobox = element.shadowRoot.querySelector('lightning-combobox');
		combobox.value = 'en_US';
		combobox.dispatchEvent(new CustomEvent('change', {
			detail: { value: 'en_US' }
		}));

		// Wait for any asynchronous operations
		await flushPromises();

		// Assert
		// Verify updateUserLocale was called with correct parameters
		expect(updateUserLocale).toHaveBeenCalledTimes(1);
		expect(updateUserLocale).toHaveBeenCalledWith({ localeCode: 'en_US' });

		// Verify that the success toast was dispatched
		expect(dispatchEventSpy).toHaveBeenCalled();
		const toastEvent = dispatchEventSpy.mock.calls.find(call => {
			return call[0].type === 'lightning__showtoast';
		});
		expect(toastEvent).toBeTruthy();
		expect(toastEvent[0].detail.variant).toBe('success');
		expect(toastEvent[0].detail.message).toContain('Locale updated successfully');

		// Verify that window.location.reload was called
		expect(window.location.reload).toHaveBeenCalled();
	});

	it('shows error toast when updateUserLocale fails', async () => {
		// Arrange
		const element = createElement('c-locale-selector', {
			is: LocaleSelector
		});

		// Mock data and methods
		const mockLocaleOptions = [
			{
				localeCode: 'en_US',
				dateFormat: 'MM/DD/YYYY',
				numberFormat: '1,234.56',
				timeFormat: 'hh:mm a',
				displayLabel: 'Date: MM/DD/YYYY | Number: 1,234.56 | Time: hh:mm a'
			}
		];
		getLocaleOptions.mockResolvedValue(mockLocaleOptions);

		// Mock updateUserLocale to throw an error
		updateUserLocale.mockRejectedValue({
			body: { message: 'An error occurred while updating your locale.' }
		});

		// Spy on dispatchEvent to capture ShowToastEvent
		const dispatchEventSpy = jest.spyOn(element, 'dispatchEvent');

		// Act
		document.body.appendChild(element);

		// Wait for asynchronous DOM updates
		await flushPromises();

		// Simulate user selecting a locale
		const combobox = element.shadowRoot.querySelector('lightning-combobox');
		combobox.value = 'en_US';
		combobox.dispatchEvent(new CustomEvent('change', {
			detail: { value: 'en_US' }
		}));

		// Wait for any asynchronous operations
		await flushPromises();

		// Assert
		// Verify updateUserLocale was called
		expect(updateUserLocale).toHaveBeenCalledTimes(1);

		// Verify that the error toast was dispatched
		expect(dispatchEventSpy).toHaveBeenCalled();
		const toastEvent = dispatchEventSpy.mock.calls.find(call => {
			return call[0].type === 'lightning__showtoast';
		});
		expect(toastEvent).toBeTruthy();
		expect(toastEvent[0].detail.variant).toBe('error');
		expect(toastEvent[0].detail.message).toContain('An error occurred while updating your locale.');

		// Verify that window.location.reload was not called
		expect(window.location.reload).not.toHaveBeenCalled();
	});

	it('displays responsive layout for locale information', () => {
		const element = createElement('c-locale-selector', {
			is: LocaleSelector
		});
		document.body.appendChild(element);

		// Verify responsive grid classes
		const gridContainer = element.shadowRoot.querySelector('.slds-grid.slds-wrap');
		expect(gridContainer).not.toBeNull();

		const columns = element.shadowRoot.querySelectorAll('.slds-col');
		columns.forEach(column => {
			expect(column.classList.contains('slds-size_1-of-1')).toBeTruthy();
			expect(column.classList.contains('slds-medium-size_1-of-3')).toBeTruthy();
		});
	});

	it('displays formatted values using browser locale', async () => {
		const element = createElement('c-locale-selector', {
			is: LocaleSelector
		});

		getLocaleOptions.mockResolvedValue(mockLocaleOptions);
		document.body.appendChild(element);
		await flushPromises();

		// Select French locale
		const combobox = element.shadowRoot.querySelector('lightning-combobox');
		combobox.dispatchEvent(new CustomEvent('change', {
			detail: { value: 'fr_FR' }
		}));
		await flushPromises();

		// Verify formatted values are displayed
		const dateValue = element.shadowRoot.querySelector('.slds-col:nth-child(1) .slds-text-body_regular');
		const numberValue = element.shadowRoot.querySelector('.slds-col:nth-child(2) .slds-text-body_regular');
		const timeValue = element.shadowRoot.querySelector('.slds-col:nth-child(3) .slds-text-body_regular');

		expect(dateValue).not.toBeNull();
		expect(numberValue).not.toBeNull();
		expect(timeValue).not.toBeNull();
	});

	it('handles browser locale conversion correctly', async () => {
		const element = createElement('c-locale-selector', {
			is: LocaleSelector
		});

		getLocaleOptions.mockResolvedValue(mockLocaleOptions);
		document.body.appendChild(element);
		await flushPromises();

		// Verify initial browser locale
		expect(element.browserLocale).toBe('en-US');

		// Change locale and verify browser locale update
		const combobox = element.shadowRoot.querySelector('lightning-combobox');
		combobox.dispatchEvent(new CustomEvent('change', {
			detail: { value: 'fr_FR' }
		}));
		await flushPromises();

		expect(element.browserLocale).toBe('fr-FR');
	});

	it('handles formatting errors gracefully', async () => {
		const element = createElement('c-locale-selector', {
			is: LocaleSelector
		});

		// Mock an invalid locale to trigger formatting errors
		getLocaleOptions.mockResolvedValue([{
			...mockLocaleOptions[0],
			browserLocale: 'invalid-locale'
		}]);

		document.body.appendChild(element);
		await flushPromises();

		// Verify fallback to en-US formatting
		const dateValue = element.shadowRoot.querySelector('.slds-col:nth-child(1) .slds-text-body_regular');
		expect(dateValue.textContent).not.toBe('');
	});
});