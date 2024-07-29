function isAnswer(obj: any) {
  return (
    typeof obj === "object" &&
    typeof obj.content === "string" &&
    typeof obj.username === "string" &&
    typeof obj.isBest === "boolean"
  );
}

function isGenerateResponseBody(obj: any) {
  return (
    typeof obj === "object" &&
    typeof obj.questionTitle === "string" &&
    Array.isArray(obj.answers) &&
    obj.answers.every(isAnswer)
  );
}

const validateSosResponse = (jsonstr: any) => {
  let obj = {};

  // first see if jsonstr is valid JSON to begin with
  try {
    obj = JSON.parse(jsonstr);
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw e;
    } else {
      throw new SyntaxError("unknown JSON syntax error");
    }
  }
  // if valid JSON, make sure it fits the expected format
  try {
    if (isGenerateResponseBody(obj)) {
      return obj;
    } else {
      throw new Error("JSON missing required properties");
    }
  } catch (_e) {
    throw new Error("JSON missing required properties");
  }
};

export { validateSosResponse };
