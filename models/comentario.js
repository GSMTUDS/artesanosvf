module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define("Comentario", {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "comentarios",
    timestamps: false
  });

  Comentario.associate = models => {
    Comentario.belongsTo(models.Usuario, {
      foreignKey: "usuario_id"
    });
  };

  return Comentario;
};