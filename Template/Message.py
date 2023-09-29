import glob
import mimetypes
import os.path
from email.message import EmailMessage


def GetMessageTemplate():
    return """
    <html lang='es'>
        <body>
            <section>
                <p>Bogot&aacute; D.C., 30 de Septiembre de 2023</p>
        
                <p>&nbsp;</p>
                
                <p>Se&ntilde;ores:</p>
                
                <p>
                    NOMBRE DEL GENERADOR<br />
                    NIT Y/O CC<br />
                    NOMBRE PERSONA A CARGO<br />
                    DIRECCI&Oacute;N<br />
                    TELEFONO<br />
                    EMAIL<br />
                    La ciudad<br />
                </p>
                
                <p>&nbsp;</p>
                
                <p><strong>ASUNTO: CONTINUIDAD DE SERVICIOS PRESTADOS Y BIENVENIDA A RESIDUOS AMBIENTALES SAS</strong></p>
                
                <p>&nbsp;</p>
                
                <p>Reciba un Cordial Saludo,</p>
                
                <p>&nbsp;</p>
                
                <p>&nbsp;</p>
                
                <p>En atenci&oacute;n a nuestra comunicaci&oacute;n previa y su voluntad de continuidad con los servicios prestados a Usted(es) antes con AMBIENTALES NACIONALES SAS y ahora con RESIDUOS AMBIENTALES SAS; le da la bienvenida a nuestra compa&ntilde;&iacute;a, as&iacute; mismo, se adjuntan los siguientes documentos:</p>
                
                <p>&nbsp;</p>
                
                <ol>
                    <li>Contrato de Transporte Integral de Residuos &ndash; DEVOLVER FIRMADO</li>
                    <li>Protocolo de Recolecci&oacute;n &ndash; Tips importantes para el GENERADOR.</li>
                    <li>RAD de Plan de Contingencia SECRETARIA DE AMBIENTE Y CAR</li>
                    <li>Licencia Ambiental Aliados (Prosarc y Ecoentorno)</li>
                    <li>Brochure de Servicios RE-AM</li>
                    <li>Certificaciones Bancarias y MEDIOS DE PAGO AUTORIZADOS: Nequi y Daviplata.</li>
                    <li>C&aacute;mara de Comercio menor a 30 d&iacute;as</li>
                    <li>Rut</li>
                    <li>Fotocopia de CC RL</li>
                </ol>
                
                <p>&nbsp;</p>
                
                <p>Agradecemos inmensamente su decisi&oacute;n, voluntad y gran confianza depositada, bajo nuestra inquebrantable voluntad y disposici&oacute;n de prestar mejores servicios esenciales para desarrollar a plenitud el objeto social de nuestros aliados.</p>
                
                <p>&nbsp;</p>
            </section>
            
            
             <footer>
                 <p>Atentamente, <br /></p>
            
                 <p>
                     <strong>YOMAIRA BEYTAR FLOREZ</strong><br />
                     <strong>C.C. 39.305.329</strong><br />
                     <strong>REPRESENTANTE LEGAL</strong><br />
                     <strong>RESIDUOS AMBIENTALES SAS</strong><br />
                     <strong>NIT.: 901.747.145-4</strong>
                </p>
             </footer>
        </body>
    </html>
"""


def AddAttachmentGeneral(mimeMessage: EmailMessage):
    for file in glob.glob('Attachment/General/*'):
        # guessing the MIME type
        type_subtype, _ = mimetypes.guess_type(file)
        maintype, subtype = type_subtype.split('/')

        with open(file, 'rb') as fp:
            attachment_data = fp.read()
            mimeMessage.add_attachment(
                attachment_data, maintype, subtype,
                filename=os.path.basename(fp.name))