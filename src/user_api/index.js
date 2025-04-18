//! This is where we will make all the User API calls 


export async function fetchLogin(username, password) {

  try {
    const response = await fetch(`https://fetch-farm-web-service.onrender.com/api/users/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          username: username,
          password: password,
        }
      )
    })
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export const fetchUserData = async () => {
  const token = window.localStorage.getItem('token')
  try {
    const response = await fetch('https://fetch-farm-web-service.onrender.com/api/users/me', {
      headers: {
      'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(error);
  }
};

export async function fetchSignUp(username, password, email) {

  try {
    const response = await fetch(`https://fetch-farm-web-service.onrender.com/api/users/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          username: username,
          password: password,
          email: email,
        }
      )
    })
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUpdateUser(username, email) {
  const token = window.localStorage.getItem('token')

  try {
    const response = await fetch(`https://fetch-farm-web-service.onrender.com/api/users/update/me`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        {
          username: username,
          email: email,
        }
      )
    })
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
