
# ACE Project Workflow

An overview of how to move changes from environment to environment.

## Prerequisites:

Ensure you have:

- VS Code
- Salesforce CLI
- git
- Access to this repository
	- A copy of this repository on your local machine.
	- If you don't have a copy and need help doing that, reach out for help.
- A connection to the environment.

### To Connect to a Salesforce Org:

`sf org login web --alias ace_[ENVIRONMENT] --instance-url https://environment.name.my.salesforce.com`

You will be prompted to authorize the CLI to access this environment on your behalf. Say yes.

## How to do work in this project.

All work should begin with a user story.  The user story should have requirements, which make all changes traceable to a business need that has been approved for implementation.

### Step 1: Claim the ticket

You should make sure the ticket is clearly in your name so no one else is duplicating your efforts.

### Step 2: Ensure you are working with the most up to date metadata

`git checkout main`

`git pull`

This will get you the latest copy of the main branch.  Our branching model is highly streamlined: work should be spun off from main and merged back into main. 

You can do this through other means as well (git lens, other VS Code plugins).  The important thing is to have a FRESH COPY OF MAIN before you create your branch.

### Step 3: Create your feature branch

There are other kinds of branches, but for the most part at this time we are adding new features and functionality to the system. We'll extend this when we have hotfixes and other branch types to concern ourselves with.

Following the convention `feature/agpmb_ticketnumber` , create your feature branch:

`git checkout -b feature/agpmb_ticketnumber`

The prefix 'feature/' provides an important string which we use to configure some of our continuous integration. Using it is not optional.

Again, you could do this in VS Code.  The important thing is that you do it, not that you do it using the command line.

### Step 4: Do your work

Self-explanatory, hopefully. Work should be performed in the development sandbox or within VS Code.  Work performed in the sandbox should be pulled down into VS Code. Work performed in VS Code should always be deployed to the sandbox as an initial sanity check of deployability  (also, who is building stuff and never checking if it works?!). The cloud explorer is a handy way to do this. You can also do this using the command line, but this may require more effort.  

### Step 5: Commit your work locally.

In essence, save your progress within your feature branch.  This is also where you can be selective and decide if you are going to include all the changes that you made or only some of them.

You should only include the changes that you want to keep, and that you are willing to send up to the next environment.

VS Code provides a very usable interface for selecting changes. You can also do this via the command line. In either case, you will *stage* your changes, and then commit them. A commit should have a descriptive message indicating what the branch would change if it were deployed.

We will not be prescriptive about using imperative messages or anything like that, but make the commit a useful data point, rather than just writing "commit".

`git commit -m "my meaningful commit message"`

###

### Step 6: Promote your feature.

For promotion of a feature, we're going to assume that you have already tested your build locally and confirmed that it works as you expect and that all unit tests continue to pass.

~~At this point, we follow a pattern of creating promotion branches to move changes from environment to environment.  This allows for granular control over what gets deployed where and when, while still benefitting from continuous integration and fast feedback.~~ 

As of 5/15/25, we are going to move away from developers being responsible for manually creating promotion branches. Instead, what developers should do is create their feature branch locally, commit changes, and then push their feature to the remote (bitbucket).  

Once work on the the feature is completed, the developer should create a pull request to the **QA** branch.  Assign Marc Palomo as the reviewer for all requests. The developer does **not** need to merge QA into their feature or create any additional promotion branches.  This will be handled via automation in Gearset.

Each environment has a corresponding branch associated to it. At the moment this consists of:
|Environment|Branch  |
|--|--|
| SIT |sit  |
| UAT |uat  |
| Production |main  |



### Step 7: Push It

At this point, the feature is at the entrance to the pipeline.  The feature may need a  review before the pull request is approved.  Assuming the PR is approved, then the feature will be deployed into QA through the Gearset pipeline process.  This process will:

 - create a promotion branch from the feature branch.
 -  merge QA into the promotion branch.
	 -  if any conflicts occur, these will be identified here. The deployment manager will work with you to resolve these conflicts.
- validate that the merged promotion branch is deployable.

When the deployment manager promotes the feature, the promotion branch will be deployed, via gearset, to the SIT environment.   During this process, any job results will continue to be posted to the Slack channel monitoring the gearset pipelines.

**As an important norm, if a deployment does fail, then this should be addressed immediately and as a priority item.  As a rule, if you cannot resolve a failing deployment within 30 minutes, then you should undo your changes until we can resolve the issue introduced.**  This helps support the need to ensure we are adhering to high quality standards including a continuously deployable build.  In general, this risk is mitigated by the validation steps along the way - nothing should be getting into the build without already having been validated repeatedly.

### Step 8: Wash, Rinse, Repeat

Assuming your changes have been deployed, the next step will be to smoke test in the next environment and indicate that the changes are ready for testing.  Subsequent promotions will be managed by Gearset Pipelines and the Deployment manager.  The communication of which promotions are ready to move to the next environment should be driven by ***JIRA Ticket Status.***  

#### For Further Info about the CLI:

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
