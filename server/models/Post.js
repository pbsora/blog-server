const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require("slugify");

const Post = new Schema({
  title: String,
  post: String,
  postedAt: { type: Date, default: Date.now },
  public: Boolean,
  slug: { type: String, required: true, unique: true },
});

Post.pre("validate", function () {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

module.exports = mongoose.model("Post", Post);
