interface StatusList {
  [key: string | number]: {
    name: string;
    short: string;
    type: "info" | "error" | "success" | "warning" | undefined;
  };
}

export const statusList: StatusList = {
  "-2": {
    name: "Compile Error",
    short: "CE",
    type: "warning",
  },
  "-1": {
    name: "Wrong Answer",
    short: "WA",
    type: "error",
  },
  0: {
    name: "Accepted",
    short: "AC",
    type: "success",
  },
  1: {
    name: "Time Limit Exceeded",
    short: "TLE",
    type: "error",
  },
  2: {
    name: "Time Limit Exceeded",
    short: "TLE",
    type: "error",
  },
  3: {
    name: "Memory Limit Exceeded",
    short: "MLE",
    type: "error",
  },
  4: {
    name: "Runtime Error",
    short: "RE",
    type: "error",
  },
  5: {
    name: "System Error",
    short: "SE",
    type: "error",
  },
  6: {
    name: "Pending",
    short: "...",
    type: "info",
  },
  7: {
    name: "Judging",
    short: "JG",
    type: "info",
  },
  8: {
    name: "Partial Accepted",
    short: "PAC",
    type: "info",
  },
  9: {
    name: "Submitting",
    short: "...",
    type: "warning",
  },
};

export const contestStatusList: StatusList = {
  "-1": {
    name: "Ended",
    short: "Ended",
    type: "error",
  },
  "0": {
    name: "Underway",
    short: "Underway",
    type: "success",
  },
  "1": {
    name: "Not Started",
    short: "Not Started",
    type: "warning",
  },
};

export default statusList;
