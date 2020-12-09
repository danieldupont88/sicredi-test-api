const jwt = require('jsonwebtoken');

const validateRequest = ({user, password}) => {
    if (!user || !password){
        throw { error: 'Requisição inválida', status: 400};
    }
    if (user === '') {
        throw { error: 'Usuário é obrigatório', status: 400};
    }
    if (password !== 'senha'){
        throw { error: 'Senha incorreta', status: 403};
    }
};

module.exports = (req, res) => {

    console.log(req.body);
    if (req.method === 'POST') {
        try {

            validateRequest(req.body);

            const id = req.body.user;
            const expiresIn = 7200; // 2h
            const token = jwt.sign({ id }, process.env.JWTSECRET, { expiresIn });
            return res.status(200).json({ auth: true, token: token });

        } catch (e) {
            console.log(e);
            res.status(e.status);
        	res.json(e);
        }
    }
}