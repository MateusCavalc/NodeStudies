module.exports = function (application) {
	application.get('/', function (req, res) {

		// res.render('bla'); // Erro 500

		res.format({
			html: () => { // If clients accepts html, do this

				res.send('Bem vindo a sua app NodeJS!');

			},
			json: () => { // If clients accepts json, do this instead

				res.json({ body: 'Bem vindo a sua app NodeJS!' });

				// or res.send({ msg: 'Bem vindo a sua app NodeJS!' });
			}
		});

	});

	application.post('/', function (req, res) {

		res.send('Received ' + JSON.stringify(req.body));

	});

}