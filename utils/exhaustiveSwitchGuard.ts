export const exhaustiveSwitchGuard = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};
