import * as React from 'react';
import {Html, Button, Text, Hr, Img, Body, Container, Head, Preview, Tailwind, Section} from "@react-email/components";

const baseURL = process.env.NODE_ENV === 'production'
    ? 'https://www.residuosambientales.com'
    : ''

type Props = {
    previewText: string,
    name: string,
    month: string,
    year: number,
}

export default function Email({previewText, name, month, year}: Props) {
    return (
        <Html>
            <Head/>
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container
                        className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto max-w-[465px]">
                        <Section className="p-[20px]">
                            <Text>Saludos cordiales,</Text>
                            <Text>Estimado generador, {name}</Text>
                            <Text className="leading-[18px]">
                                <strong>RESIDUOS AMBIENTALES SAS</strong>, le envía adjunto el
                                <strong> CERTIFICADO DE DISPOSICIÓN FINAL</strong>,
                                correspondiente al mes de {month} de {year}.
                            </Text>
                            <Text>Muchas gracias por su atención</Text>
                            <Text>Cordialmente.</Text>

                        </Section>

                        <Section className="p-[20px] bg-[#FF3333] text-white text-center">
                            <Img width={128} height={128} alt="Logo Residuos Ambientales"
                                 className="mx-auto"
                                 src={`${baseURL}/static/Logo.png`}/>

                            <Text className="font-bold mb-0 mx-0 mt-[20px] p-0 text-lg">
                                Ricardo Suarez
                            </Text>
                            <Text className="font-bold m-0 p-0 text-lg">
                                AREA DE LOGISTICA Y PROGRAMACION.
                            </Text>
                            <Text className="font-bold uppercase m-0 p-0">
                                Residuos Ambientales SAS
                            </Text>

                            <Button
                                className="text-white mb-0 mx-0 mt-[30px] p-0"
                                href="mailto:logistica@residuosambientales.com">
                                logistica@residuosambientales.com
                            </Button>
                            <Text className="m-0 p-0">
                                Contacto : + 57 310 445 6041 – 313 411 3584
                            </Text>
                            <Button
                                className="text-white m-0 p-0"
                                href="https://www.residuosambientales.com">
                                www.residuosambientales.com
                            </Button>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

Email.PreviewProps = {
    previewText: 'ASUNTO: CERTIFICADOS DE DISPOSICIÓN FINAL - ENERO 2024 - RE-AM',
    name: "Generador Ambiental - Sede 1",
    month: "Enero",
    year: 2024,
} satisfies Props