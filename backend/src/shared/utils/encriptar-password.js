const bcrypt = require('bcrypt');

async function encriptarContrasena(contrasena) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(contrasena, saltRounds);
    console.log('Contraseña original:', contrasena);
    console.log('Contraseña encriptada:', hash);
    console.log('\nCopia este hash y úsalo en tu base de datos');
    return hash;
}

const contrasenaAEncriptar = process.argv[2] || 'test123';

encriptarContrasena(contrasenaAEncriptar)
    .then(() => process.exit(0))
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
