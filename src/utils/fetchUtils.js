export const fetchWithErrorHandling = async (url, options = {}) => {
    try {
      console.log(url);
      const response = await fetch(url, options);
  
      // Handle non-2xx status codes
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.error?.message || "An error occurred";
  
        // Create a custom error object with the relevant data
        const error = new Error(errorMessage);
        error.status = response.status;
        error.statusText = response.statusText;
        error.details = errorData?.error;
  
        throw error; // Throw the custom error object
      }
  
      return response; // Return parsed response on success
    } catch (error) {
      // Log the error for debugging (optional)
      console.error("Fetch error:", error);
  
      // Re-throw the error with additional context
      throw error;
    }
  };