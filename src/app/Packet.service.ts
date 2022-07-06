import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Packet } from "./Packet";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PacketService {
    private apiServerUrl: String = 'http://scholarbowlquestionsspringboot-env.eba-ygnaamx8.us-east-1.elasticbeanstalk.com';

    constructor(private http: HttpClient) { }

    public addPacket(packet: Packet): Observable<Packet>{
        return this.http.post<Packet>(`${this.apiServerUrl}/api/packets`, packet)
    }

    public getPackets(): Observable<Packet[]> {
        return this.http.get<Packet[]>(`${this.apiServerUrl}/api/packets`);
    }

    public getPacketById(packetId: number): Observable<Packet> {
        return this.http.get<Packet>(`${this.apiServerUrl}/api/packets/${packetId}`);
    }

    public updatePacket(packet : Packet, packetId: number): Observable<Packet> {
        return this.http.put<Packet>(`${this.apiServerUrl}/api/packets/update/${packetId}`, packet);
    }

    public deletePacket(packetId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiServerUrl}/api/packets/${packetId}`);
    }

}