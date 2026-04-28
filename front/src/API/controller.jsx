const registerUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:3000/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to register user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error("Failed to login user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

const createAccount = async (accountData) => {
  try {
    const response = await fetch("http://localhost:3000/api/account/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountData),
    });
    if (!response.ok) {
      throw new Error("Failed to register user");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const decryptPassword = async (id, encryptedPassword) => {
  try {
    const url = new URL("http://localhost:3000/api/account/decrypt");
    url.searchParams.append("id", id);
    url.searchParams.append("encryptedPassword", encryptedPassword);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to decrypt accounts");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error decrypting accounts:", error);
    throw error;
  }
};

export { registerUser, loginUser, createAccount, decryptPassword };
