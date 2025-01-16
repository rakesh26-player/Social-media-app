const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt") // It scrambles a user's password into a unique code
//register
router.post('/register', async (req, res) => {

    try { //generate new password
        const salt = await bcrypt.genSalt(10); // line generates a salt (a random string) with 10 rounds of processing
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //save user and return res
        const user = await newUser.save()
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
})

//login
// router.post("/login", async (req, res) => {
//     try {
//       const user = await User.findOne({ email: req.body.email });
//       !user && res.status(404).json("user not found");
  
//       const validPassword = await bcrypt.compare(req.body.password, user.password)
//       !validPassword && res.status(400).json("wrong password")
  
//       res.status(200).json(user)
//     } catch (err) {
//       res.status(500).json(err)
//     }
  // });
router.post("/login", async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("user not found"); // Stop further execution
    }

    // Validate the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json("wrong password"); // Stop further execution
    }

    // If both checks pass, send the user data
    return res.status(200).json(user);
  } catch (err) {
    // Handle server errors
    return res.status(500).json(err);
  }
});


module.exports = router;