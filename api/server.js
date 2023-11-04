import app from "./index.js";

const PORT = import.meta.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
