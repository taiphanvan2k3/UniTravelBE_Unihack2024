# TravelUnihack Project

A project of Unihack 2024 about Traveling

## Git Flow

- Step 1: Create a task in Trello: https://trello.com/b/QSFegORU/unihack2024, moving task to `InProgress` column, assign to yourself
- Step 2: checkout to `main`, pull newest code from `main`
    ```
    git checkout main
    git pull main
    ```
- Step 3: Create branch for task, base in branch `main`

    **Rule of branch name:**

    - If `Tracker` in Redmine is `'Feature'` or `'Subtask'` of Feature, branch name start with `feat/`
    - If `Tracker` in Redmine is `'Bug'` or `'Subtask'` of Bug, branch name start with `fix/`
    - If other, branch name start with `task/`
    - After that, concat with string `uni-[issueId]`

    ```
    git checkout -b feat/uni-create-ui-for-login-page develop
    ```
- Step 4: When commit, message of commit follow rule
    - If column `Tracker` in Redmine is `'Feature'`, branch name start with `feat: `
    - If column `Tracker` in Redmine is `'Bug'`, branch name start with `fix: `
    - If other, branch name start with `task: `
    - Next is string `[Uni]`
    - Next is commit content

    Example: `feat: [Uni] Coding layout for page login`
- Step 5: When create merge request
    
    **Rule of merge request name:**
    
    - Start with `feat` or `fix` or `chore` then concat with `[Uni]`
    - Next is  merge request content

        Example: `feat: [Uni] Create login page`

    **Rule of merge request description:**

    - In **`What does this MR do and why?`**, replace _`Describe in detail what your merge request does and why.`_ with your content of this merge request
    - In **`Screenshots or screen recordings`**, replace _`These are strongly recommended to assist reviewers and reduce the time to merge your change.`_ with screen recordings of feature or task for this merge request
    - Check the checklist
    - Select approver
    - Select merger
