module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });

    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Posts.hasMany(models.Dislikes, {
      onDelete: "cascade",
    });
  };
  return Posts;
};
