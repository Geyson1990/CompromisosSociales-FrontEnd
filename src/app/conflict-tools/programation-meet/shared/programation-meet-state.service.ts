import { Injectable } from "@angular/core";
import { SectorMeetDto, SectorMeetTerritorialUnitDto } from "@shared/service-proxies/application/sector-meet-program-proxie";

@Injectable()
export class ProgramationMeetStateService {
    
    sectorMeet: SectorMeetDto;
    territorialUnits: SectorMeetTerritorialUnitDto[] = [];
}