# Group Log README

### \*\*_Group Log (3/14/2024)_

service/post-walk WIP.

Post_Walk setup done. For entities that has other dependencies, see
setup and initialization implementation.

Also moved Group Log inside src folder to keep main README file clean.

<br>

### \*\*_Group Log (3/13/2024)_

Approved merge from react-setup into main

FYI Branch Naming Conventions:

- For a back-end service or controller -> service/branch-name
- For a front-end feature -> feature/branch-name

<br>

### \*\*_Group Log (3/11/2024)_

Please review frontend setup 1 pull request. I reorganized the directory.

Please note before merging, save your .env files for the backend and place it in _src/backend_. This is to separate node modules for the backend and the front end.

Also, please install dependencies:

```
npm install

```

In both _src/backend_ and _src/client_.

React will be deployed in localhost:3000, while fetching the data in localhost:8800.
