const path = require("path");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError} = require("../errors");
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProductImageLocal = async (req, res) => {
    // check if file is uploaded
    if(!req.files){
        throw new BadRequestError("No File Uploaded");
    }

    const productImage = req.files.image;
    
    // check if file type is image
    if(!productImage.mimetype.startsWith("image")){
        throw new BadRequestError("Please upload image");
    }

    // check size of image (Here we restrict >1MB image)
    const maxSize = 1024 * 1024;
    if(productImage.size > maxSize){
        throw new BadRequestError("Please upload image less than 1MB");
    }
    
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({image: {src: `/uploads/${productImage.name}`}})
}

const uploadProductImage = async (req, res) => {
    // search for tempFilePath and give option 'file-upload' folder (we created in cloudinary) if not then it will automatically create folder
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {use_filename: true, folder: 'file-upload'});

    // we dont want our images in local tmp folder so we unlink after upload into cloud
    fs.unlinkSync(req.files.image.tempFilePath);
    
    return res.status(StatusCodes.OK).json({image: {src: result.secure_url}});
}

module.exports = uploadProductImage;