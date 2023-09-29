import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SocialConflictSensibleRiskDto, SocialConflictSensibleRiskLocationDto } from '@shared/service-proxies/application/social-conflict-sensible-proxie';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

@Component({
    selector: 'create-edit-risk-information-social-conflict-sensible',
    templateUrl: 'create-edit-risk-information.component.html',
    styleUrls: [
        'create-edit-risk-information.component.css'
    ]
})
export class CreateEditRiskInformationSocialConflictSensibleComponent extends AppComponentBase {

    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<{ value: SocialConflictSensibleRiskLocationDto, index: number }> = new EventEmitter<{ value: SocialConflictSensibleRiskLocationDto, index: number }>();

    risks: SocialConflictSensibleRiskDto[];
    item: SocialConflictSensibleRiskLocationDto = new SocialConflictSensibleRiskLocationDto();
    riskTime: Date;
    rowIndex: number;

    active: boolean;
    saving: boolean;
    
    constructor(_injector: Injector) {
        super(_injector);
    }

    show(rowIndex: number, item: SocialConflictSensibleRiskLocationDto, risks: SocialConflictSensibleRiskDto[]): void {
        this.rowIndex = rowIndex;
        this.saving = false;
        this.item = new SocialConflictSensibleRiskLocationDto(item);
        this.riskTime = item?.riskTime ? item.riskTime.toDate() : null;
        this.risks = Object.assign([], risks);

        if (this.item?.risk && this.item.risk.id != -1) {
            const managementIndex: number = this.risks.findIndex(p => p.id == this.item.risk.id);

            if (managementIndex == -1) {
                this.risks.push(SocialConflictSensibleRiskDto.fromJS(this.item.risk));
                this.risks = this.risks.sort((a, b) => a.name.localeCompare(b.name));
            }
        }

        this.active = true;
        this.modal.show();
    }

    onRiskChange(event: any) {
        const riskId: number = +event.target.value;
        const index: number = this.risks.findIndex(p => p.id == riskId);

        if (index != -1) {
            this.item.risk.name = this.risks[index].name;
            this.item.risk.color = this.risks[index].color;
        } else {
            this.item.risk.id = -1;
            this.item.risk.name = undefined;
            this.item.risk.color = undefined;
        }
    }

    onShown(): void {
        document.getElementById('RiskDescription').focus();
    }

    close(): void {
        this.modal.hide();
        this.active = false;
    }

    save(): void {
        if(this.item.risk.id == -1) {
            this.message.error('Debe seleccionar el nivel de riesgo antes de agregarlo a la lista', 'Aviso');
            return;
        }
        if (!this.riskTime || (<any>this.riskTime == 'Invalid Date')) {
            this.message.error('Debe seleccionar la fecha la observación del nivel de riesgo antes de agregarlo a la lista', 'Aviso');
            return;
        }

        this.item.riskTime = moment(this.formatDateISOString(this.riskTime));
        this.modalSave.emit({ index: this.rowIndex, value: this.item });
        this.close();
    }
}
