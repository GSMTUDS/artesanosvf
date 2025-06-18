module.exports = (sequelize, DataTypes) => {
  const Amistad = sequelize.define("Amistad", {
    id_amistad: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    emisor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receptor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "aceptada", "rechazada"),
      defaultValue: "pendiente"
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'amistades',
    timestamps: false
  });

  return Amistad;
};

