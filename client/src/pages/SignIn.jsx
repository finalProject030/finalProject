const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    dispatch(signInStart());
    const res = await fetch(
      "https://finalproject-a66r.onrender.com/api/auth/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await res.json();
    if (data.success === false) {
      dispatch(signInFailure(data.message));
      return;
    }
    dispatch(signInSuccess(data));
    navigate("/");
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};
