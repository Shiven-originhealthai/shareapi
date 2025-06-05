import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, response } from "express";
 import * as QRCode from 'qrcode';
 import * as otpGenerator from 'otp-generator'

const share_object: Record<string, boolean> = {};
//const otpValidationResponse={}
const otpStore: Record<string, string> = {};
@Injectable()
export class ImageService {
    constructor(private readonly jwtService:JwtService){}
    
    generate_share_token(payload : any ): string {
        return this.jwtService.sign(payload);
    }
    generate_otp_sevice(length:number, token: string) : string {
        const otp = otpGenerator.generate(length,{
            digits:true,
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        otpStore[token] = otp;
        console.log(`Generated OTP for token ${token}: ${otp}`);
        return otp;
    }
    async generateQrCode(data: string): Promise<string> {
       try {
         const qrCodeDataUrl = await QRCode.toDataURL(data, {
           errorCorrectionLevel: 'H', // High error correction for better readability
           type: 'image/png', // Generate as PNG image
           margin: 1, // Margin around the QR code
           width: 300, // Width of the QR code
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
        share_object[share_token] = true;
        const otp = this.generate_otp_sevice(4, share_token);// Generate and log OTP for this token
        console.log(`OTP for token ${share_token}: ${otp}`);
        const shareUrl =`http://localhost:3000/share/${share_token}`;
        const qrCodeDataUrlRecieved =  await this.generateQrCode(shareUrl);
        return {
            success:true,
            qrCodeUrl:qrCodeDataUrlRecieved,
            shareUrl:shareUrl,
            otp // (optional: for demo, remove in production)
         };
    }
    validate(tokenRecieved:string):{}{
        if (share_object[tokenRecieved]) {
            return { response: true };
        } else {
            return { response: false };
        }
    }

    validate_otp(req:Request){
        const token: string = req.body.token;
        const recieved_otp: string = req.body.enteredOtp;
        if(recieved_otp.length > 4){
            return {response : false, Error:"The otp is too long to process"}
        }
        const generated_otp = parseInt(otpStore[token]);
        console.log(`Verifying OTP for token ${token}: received ${recieved_otp}, expected ${generated_otp}`);
        if (generated_otp && parseInt(recieved_otp) === generated_otp) {
            return { response: true };
        } else {
            return { response: false , Error:"The OTP is invald Please enter correct otp " };
        }
    }

}