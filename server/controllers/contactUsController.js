const contactUsModel = require('../models/contactUsModel');
const contactUsEmailHelper = require('../utils/contactUsEmailHelper');

const createContactUs = async (req, res) => {
  try{
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // For authenticated users, check daily limit
    if (req.user && req.user._id) {
      const submissionToday = await contactUsModel.countDocuments({
        userId: req.user._id,
        createdAt: { $gte: today }
      });
      
      if (submissionToday >= 2) {
        return res.status(400).json({
          success: false, 
          message: "You can only submit the contactUs form twice a day. Please be patient our team member will get back to you as soon as possible."
        });
      }
    }
    
    // For non-authenticated users, you might want to check by IP or email
    if (!req.user) {
      const submissionTodayByEmail = await contactUsModel.countDocuments({
        email: req.body.email,
        createdAt: { $gte: today }
      });
      
      if (submissionTodayByEmail >= 2) {
        return res.status(400).json({
          success: false, 
          message: "You can only submit the contactUs form twice a day per email address."
        });
      }
    }
    
    // Prepare contact data
    const contactUsData = {
      ...req.body,
      userId: req.user ? req.user._id : null
    };

    const createContactUs = await contactUsModel.create(contactUsData);
    await contactUsEmailHelper("contactUs.html", contactUsData.email, {
      name: contactUsData.name,
      email: contactUsData.email,
      phone: contactUsData.phone,
      message: contactUsData.message
    });

    res.status(200).json({success: true, message: "ContactUs entry created successfully. Our team member will get back to you as soon as possible.", data: createContactUs});
  }catch(err){
    res.status(500).json({success: false, message: "Cannot create contactUs entry", error: err.message})
  }
}

module.exports = {createContactUs}