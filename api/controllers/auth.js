import {db} from "../db.js"; 

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? or username = ?";
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User already exists!");
    // const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
    // const values = [req.body.username, req.body.email, req.body.password];
    // db.query(q, [values], (err, data) => {
    //   if (err) return res.json(err);
    //   return res.status(200).json("User has been created.");
    // });
  });
};

export const login = (req, res) => {
  res.json({ message: "User registered successfully" });
};

export const logout = (req, res) => {
  res.json({ message: "User registered successfully" });
};
