module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  // Associate each comment with its parent comment (if any)
  Comments.belongsTo(Comments, { as: "parentComment", foreignKey: "parentId" });
  Comments.hasMany(Comments, { as: "replies", foreignKey: "parentId" });

  return Comments;
};
