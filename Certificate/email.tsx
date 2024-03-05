import * as React from 'react';
import {Html, Button, Text, Hr} from "@react-email/components";

export function Email() {
    return (
        <Html>
            <Text>Saludos cordiales,</Text>
            <Text>Estimado generador,</Text>
            <Text>
                RESIDUOS AMBIENTALES SAS, le envía adjunto el CERTIFICADO DE DISPOSICIÓN FINAL, correspondiente
                al mes de enero de 2024.
            </Text>
            <Text>Muchas gracias por su atención</Text>
            <Text>Cordialmente,</Text>

            <Hr/>
            <Text style={{fontStyle: 'italic', fontWeight: "bolder"}}>
                AREA DE LOGISTICA Y PROGRAMACION.
            </Text>
            <Text style={{fontStyle: 'italic'}}>
                Residuos Ambientales SAS
            </Text>
            <Button
                style={{fontStyle: 'italic'}}
                href="mailto:logistica@residuosambientales.com">
                logistica@residuosambientales.com
            </Button>
            <Text style={{fontStyle: 'italic'}}>Contacto : + 57 310 445 6041 – 313 411 3584</Text>
            <Button
                style={{fontStyle: 'italic'}}
                href="https://www.residuosambientales.com">
                www.residuosambientales.com
            </Button>
        </Html>
    )
}