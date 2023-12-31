/* importar o módulo do framework express */
var express = require('express');

/* importar o módulo do consign */
var consign = require('consign');

/* importar o módulo do body-parser */
var bodyParser = require('body-parser');

/* importar o módulo do express-validator */
var expressValidator = require('express-validator');

/* iniciar o objeto do express */
var app = express();

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({ extended: true })); // for html form data
app.use(bodyParser.json()); // for json body

/* configurar o middleware express-validator */
app.use(expressValidator());

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	.then('app/models')
	.then('app/controllers')
	.into(app);

/* middleware para tratamento de páginas de status */
app.use((req, res, next) => {

	res.status(404).render('error/404'); // Se statusCode for 404, retorna página de erro personalizada.

	next(); // Continua a execução do servidor.
});

/* middleware para tratamento de erros internos */

app.use((err, req, res, next) => {

	res.status(500).render('error/500'); // Se statusCode for 500, retorna página de erro personalizada.

	next();
});

/* exportar o objeto app */
module.exports = app;