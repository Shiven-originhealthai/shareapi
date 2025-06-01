import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, response } from "express";
 import * as QRCode from 'qrcode';
 import * as otpGenerator from 'otp-generator'

const share_object={}
const otpValidationResponse={}
@Injectable()
export class ImageService {
    constructor(private readonly jwtService:JwtService){}
    
    generate_share_token(payload : any ): string {
        return this.jwtService.sign(payload);
    }
    generate_otp_sevice(length:number) : number {
        return otpGenerator.generate(length,{
            digits:true,
            upperCaseAlphbets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });

    }
    async generateQrCode(data: string): Promise<string> {
       try {
         const qrCodeDataUrl = await QRCode.toDataURL(data, {
           errorCorrectionLevel: 'H', // High error correction for better readability
           type: 'QrImage/png', // Generate as PNG image
           quality: 0.9, // Image quality (0.0 - 1.0)
           margin: 1, // Margin around the QR code
           width: 300, // Width of the QR code
           height: 300, // Height of the QR code
         });
         return qrCodeDataUrl;
       } catch (error) {
         console.error('Error generating QR code:', error);
         throw new Error('Failed to generate QR code');
       }
     }
    async read_process(req:Request) {
        const cached_data = {}
        cached_data["fetched"] = req.body.arr;
        const share_token = this.generate_share_token(cached_data);
        console.log(share_token);
        share_object["tokenSent"] = share_token;
        const shareUrl =`http://localhost:3000/share/${share_token}`;
        const qrCodeDataUrlRecieved =  await this.generateQrCode(shareUrl);

        //return {shareUrl : `http://localhost:3001/images/${share_token}`};
        return {
            success:true,
            qrCodeUrl:qrCodeDataUrlRecieved,
            shareUrl:shareUrl
         };
    }
    validate(tokenRecieved:string):{}{
        console.log(share_object["tokenSent"])
        if(tokenRecieved === share_object["tokenSent"] ){
            return {
                response:true
            }
        }
        else{
            return {
                    response:false
            }
        }

    }

    validate_otp(req:Request){
            const recieved_otp:number = req.body.enteredOtp;
            console.log(typeof(recieved_otp));
            //const otp_generated = this.generate_otp_sevice(4);
            //console.log(otp_generated)
            try{
                if(recieved_otp === 1234){
                        otpValidationResponse["validationResonpe"] = true
                }
                else{
                    otpValidationResponse["validationResonpe"] = false
                }

            }
            catch{

            }
            return otpValidationResponse

    }

}