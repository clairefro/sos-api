function validateEnvVars(requiredVars: string[]): boolean {
  const missingVars = [];
  if (requiredVars.length > 0) {
    for (const varName of requiredVars) {
      if (process.env[varName] === undefined) {
        // @ts-ignore
        missingVars.push(varName);
      }
    }
  }

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
    process.exit(1);
  }

  return true;
}

export { validateEnvVars };
