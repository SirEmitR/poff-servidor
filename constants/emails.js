const recoveryPassword = `<body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    <h1>Codigo de recuperación</h1>
    <p>Recibimos una solicitud para restablecer tu contraseña. Para continuar, ingresa el siguiente código de recuperación:</p>
    <h2>%codigo%</h2>
    <p><b>Importante:</b>Este código es válido por 60 minutos.</p>
    <p>Si no solicitaste restablecer tu contraseña, ignora este mensaje.</p>
    <p>Gracias.</p>

    <div style="font-size: small;">
        <p>Este correo se ha enviado de forma automática, por favor no respondas a este mensaje.</p>
        <p>Si tienes alguna pregunta, por favor contáctanos a través de nuestro correo electrónico:<a href="mailto:
            social@solsoftware.mx">
            social@solsoftware.mx</a></p>
        <p>Este correo electrónico fue enviado automáticamente, por favor no respondas a este mensaje.</p>
        <p>Gracias, equipo Perla de Occidente Flag Football</p>
    </div>
</body>`

export default {
    recoveryPassword
}