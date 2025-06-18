module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Perfil', {
    id_perfil: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_real: {
      type: DataTypes.STRING
    },
    intereses: {
      type: DataTypes.TEXT
    },
    biografia: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'perfiles',
    timestamps: false
  });
};
