module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define("Album", {
    id_album: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visibilidad: {
  type: DataTypes.ENUM('publica', 'privada'),
      allowNull: false,
      defaultValue: 'publica'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'albumes',
    timestamps: false
  });

  Album.associate = (models) => {
    Album.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
  };

  return Album;
};