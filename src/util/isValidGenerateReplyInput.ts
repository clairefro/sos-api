function isValidGenerateReplyInput(obj: any) {
  if (typeof obj !== "object" || obj === null || !Array.isArray(obj.messages)) {
    return false;
  }

  for (const item of obj.messages) {
    if (
      typeof item !== "object" ||
      typeof item.role !== "string" ||
      typeof item.content !== "string"
    ) {
      return false;
    }
  }

  return true;
}

export { isValidGenerateReplyInput };
