module.exports = (sequelize, DataTypes) => {
  const Imagen = sequelize.define("Imagen", {
    id_imagen: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    album_id: {
      type: DataTypes.INTEGER,
      allowNull: true // o false si querés que sea obligatorio
    },
    ruta_archivo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    visibilidad: { 
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "privado" // puede ser público o privado
    },
    fecha_subida: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'imagenes',
    timestamps: false
  });

  Imagen.associate = (models) => {
    Imagen.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });
    Imagen.belongsTo(models.Album, {
      foreignKey: 'album_id',
      as: 'album'
    });
  };

  return Imagen;
};