export const getErrorMessage = (error) => {
  return `Error ${error.status || ""}: ${error.details?.message || error.message}\nReason: ${
            error.details?.errors?.[0]?.reason || "Unknown"
          }`
}
