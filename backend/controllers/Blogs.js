const BlogDetails = require("../_models/BlogDetails.model");

//create
const CreateBlogPost = async (req, res) => {
  try {
    const newBlogPost = new BlogDetails(req.body);
    const savedBlogPost = await newBlogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create a new blog post', error: error.message });
  }
};

//show all
const GetAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogDetails.find();
    res.status(200).json(blogPosts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch blog posts', error: error.message });
  }
};

//show by id
const GetBlogPostById = async (req, res) => {
  try {
    const blogPost = await BlogDetails.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blogPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch the blog post', error: error.message });
  }
};

//edit
const UpdateBlogPost = async (req, res) => {
  try {
    const updatedBlogPost = await BlogDetails.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(updatedBlogPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update the blog post', error: error.message });
  }
};

//delete
const DeleteBlogPost = async (req, res) => {
  try {
    const deletedBlogPost = await BlogDetails.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete the blog post', error: error.message });
  }
};

module.exports = { CreateBlogPost, GetAllBlogPosts, GetBlogPostById, UpdateBlogPost, DeleteBlogPost };
