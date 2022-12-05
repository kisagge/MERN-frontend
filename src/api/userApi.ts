const getMyInfo = async (token: string) => {
  try {
    const response = await fetch("http://localhost:4000/api/user/me", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    return {
      ok: response.ok,
      json,
    };
  } catch (err) {
    return {
      ok: false,
      json: {
        error: err,
      },
    };
  }
};

export { getMyInfo };
