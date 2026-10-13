import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
    inject,
    NgZone
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faArrowsRotate, faPaperPlane, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';
import { EditJewelService } from '../../services/editorServices/editJewel.service.js';
import { BaseStructureService } from '../../services/ringParts/base-structure.service.js';
import { effect } from '@angular/core';
import { environment } from '../../../environments/environment.prod.js';

@Component({
    selector: 'app-chatbot',
    templateUrl: 'chatbot.component.html',
    styleUrls: ['chatbot.component.scss'],
    standalone: true,
    imports: [CommonModule, FontAwesomeModule]
})
export class AppChatbotComponent implements OnInit, AfterViewInit {
    faMoon = faMoon;
    faArrowsRotate = faArrowsRotate;
    faPaperPlane = faPaperPlane;
    faArrowsUpDown = faArrowsUpDown;

    @ViewChild('chatMessages') chatMessages!: ElementRef<HTMLDivElement>;
    @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

    messages: { text: string; sender: 'user' | 'bot' }[] = [];
    activeButtons: any[] | null = null;

    currentLanguage: 'es' | 'en' = 'es';

    isTyping = false;
    private typingTimeout: any;

    baseStructureService = inject(BaseStructureService);
    editJewelService = inject(EditJewelService);
    http = inject(HttpClient);
    cdr = inject(ChangeDetectorRef);

    private API_URL = environment.chatbotUrl;
    // private API_URL = 'http://localhost:5005/webhooks/rest/webhook'

    width: number = 320;
    height: number = 400;

    private currentRingId: string | null = null;
    private currentProfileId: string | null = null;

    private ngZone = inject(NgZone);

    private senderId: string;

    constructor() {
        this.senderId = this.generateUUID();

        effect(() => {
            const currentJewel = this.editJewelService.jewel();
            const newRingId = currentJewel.baseStructure || null;

            if (this.currentRingId !== newRingId) {
                this.currentProfileId = null;
            }

            this.currentRingId = newRingId;

            if (currentJewel.profile) {
                this.currentProfileId = currentJewel.profile;
            }
        });
    }

    async ngOnInit(): Promise<void> {
        this.syncCurrentRing();

        this.showTyping();

        const available = await this.checkServerAvailability(3000);

        this.hideTyping();

        if (!available) {
            this.addMessage(
                'En estos instantes no puedo atenderle, inténtelo de nuevo más tarde.',
                'bot'
            );
            return;
        }

        this.showInitialMessage();
    }

    ngAfterViewInit(): void {
        this.messageInput.nativeElement.focus();
    }

    private showInitialMessage(): void {
        setTimeout(() => {
            this.showTyping();

            setTimeout(() => {
                this.hideTyping();

                if (this.currentLanguage === 'es') {
                    this.addMessage('¡Hola! Soy Luna. ¿En qué puedo ayudarle hoy?', 'bot');

                    this.activeButtons = [
                        { title: 'I want you to speak in english', payload: 'I want you to speak in english' },
                        { title: 'Quiero editar mi anillo', payload: 'Quiero editar mi anillo' },
                        { title: '¿Con qué gemas trabajáis?', payload: '¿Con qué gemas trabajáis?' },
                        { title: 'Quiero saber la gema de mi signo zodiacal', payload: 'Quiero saber la gema de mi signo zodiacal' }
                    ];
                } else {
                    this.addMessage('Hello! I am Luna. How can I help you today?', 'bot');

                    this.activeButtons = [
                        { title: 'Quiero que hables en español', payload: 'Quiero que hables en español' },
                        { title: 'I want to edit my ring', payload: 'I want to edit my ring' },
                        { title: 'What gemstones do you work with?', payload: 'What gemstones do you work with?' },
                        { title: 'I want to know the gemstone of my zodiac sign', payload: 'I want to know the gemstone of my zodiac sign' }
                    ];
                }

                this.scrollToBottom();
                this.cdr.detectChanges();
            }, 1000);

        }, 300);
    }

    addMessage(text: string, sender: 'user' | 'bot'): void {
        this.messages.push({
            text: this.convertUrlsToLinks(text),
            sender
        });

        this.scrollToBottom();
        this.cdr.detectChanges();
    }

    sendMessage(): void {
        const text = this.messageInput.nativeElement.value.trim();
        if (!text) return;

        this.sendMessageToRasa(text, text);
        this.messageInput.nativeElement.value = '';
    }

    onButtonClick(button: any): void {
        this.sendMessageToRasa(button.title, button.payload);
    }

    toggleLanguage(): void {
        const payload =
            this.currentLanguage === 'es'
                ? 'I want you to speak in english'
                : 'Quiero que hables en español';

        this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';

        this.sendMessageToRasa(payload, payload);
    }

    private sendMessageToRasa(title: string, payload: string): void {
        this.activeButtons = null;
        this.addMessage(title, 'user');
        this.showTyping();

        const currentJewel = this.editJewelService.jewel();
        const currentMaterialId = currentJewel.material || null;
        const currentVariantId = currentJewel.variant || null;
        const selectedGemIndex = this.editJewelService.selectedGemIndex();
        const currentSetting = currentJewel.settings?.[selectedGemIndex];
        const currentSettingId = currentSetting?.id || null;
        const currentClawNumberId = currentSetting?.clawNumber || null;
        const currentCutId = currentSetting?.gem?.cut || null;
        const currentBoxShapeId = currentJewel.box?.shape || null;

        this.http.post<any[]>(this.API_URL, {
            message: payload,
            sender: this.senderId,
            metadata: {
                ring_id: this.currentRingId,
                profile_id: this.currentProfileId,
                material_id: currentMaterialId,
                variante_id: currentVariantId,
                variant_id: currentVariantId,
                setting_id: currentSettingId,
                claw_number_id: currentClawNumberId,
                cut_id: currentCutId,
                box_shape_id: currentBoxShapeId
            }
        }).subscribe({
            next: (data) => {
                this.ngZone.run(() => {
                    this.hideTyping();

                    if (data?.length) {
                        data.forEach(msg => this.processRasaMessage(msg));
                    }

                    this.scrollToBottom();
                    this.cdr.detectChanges();
                });
            },
            error: () => {
                this.hideTyping();
                this.addMessage(
                    this.currentLanguage === 'es'
                        ? 'Error: No puedo conectar con el servidor.'
                        : 'Error: I cannot connect to the server.',
                    'bot'
                );
            },
            complete: () => {
                this.messageInput.nativeElement.focus();
            }
        });
    }

    private processRasaMessage(msg: any): void {

        const payloadType = msg?.type || msg?.custom?.type || msg?.json_message?.type || msg?.payload?.type || msg?.data?.type;

        if (msg?.text) this.addMessage(msg.text, 'bot');

        if (payloadType === 'show_ring') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleShowRing(data);
        }

        if (payloadType === 'change_base') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeBase(data);
        }

        if (payloadType === 'change_profile') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeProfile(data);
        }

        if (payloadType === 'change_variante') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeVariante(data);
        }

        if (payloadType === 'change_material') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeMaterial(data);
        }

        if (payloadType === 'change_pureza') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangePureza(data);
        }

        if (payloadType === 'change_gema') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeGema(data);
        }

        if (payloadType === 'change_forma_gema') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeFormaGema(data);
        }

        if (payloadType === 'change_engaste') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeEngaste(data);
        }

        if (payloadType === 'change_claw_number') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeClawNumber(data);
        }

        if (payloadType === 'change_claw_type') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeClawType(data);
        }

        if (payloadType === 'change_box_shape') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeBoxShape(data);
        }

        if (payloadType === 'change_box_outer_color') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeBoxOuterColor(data);
        }

        if (payloadType === 'change_box_inner_color') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeBoxInnerColor(data);
        }

        if (payloadType === 'change_box_complete') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeBoxComplete(data);
        }

        if (payloadType === 'change_gem_origin') {
            const data = msg?.custom || msg?.json_message || msg || msg?.payload || msg?.data;
            this.handleChangeGemOrigin(data);
        }

        const buttons = msg?.buttons || msg?.custom?.buttons || msg?.json_message?.buttons || msg?.payload?.buttons;

        if (buttons?.length) {
            this.activeButtons = buttons;
        }

        this.scrollToBottom();
        this.cdr.detectChanges();
    }

    private async handleChangeProfile(data: any): Promise<void> {
        const profileId = data?.profile_id;
        if (!profileId) return;

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.currentProfileId = profileId;
                this.editJewelService.editProfile(profileId);

                await new Promise(resolve => setTimeout(resolve, 150));

                const currentJewel = this.editJewelService.jewel();
                const newVariantId = currentJewel.variant;

                this.cdr.detectChanges();
            } catch (err) {
            }
        });
    }

    onKeyPress(event: KeyboardEvent): void {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    showTyping(): void {
        this.hideTyping();
        this.isTyping = true;
        this.scrollToBottom();
        this.cdr.detectChanges();

        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
            this.cdr.detectChanges();
        }, 1500);
    }

    hideTyping(): void {
        this.isTyping = false;
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        this.cdr.detectChanges();
    }

    scrollToBottom(): void {
        setTimeout(() => {
            this.chatMessages.nativeElement.scrollTop =
                this.chatMessages.nativeElement.scrollHeight;
        }, 50);
    }

    initResize(event: MouseEvent, direction: 'top' | 'left' | 'corner'): void {
        event.preventDefault();

        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = this.width;
        const startHeight = this.height;

        const onMouseMove = (e: MouseEvent) => {
            if (direction === 'left' || direction === 'corner') {
                const deltaX = startX - e.clientX;
                this.width = Math.max(250, startWidth + deltaX);
            }

            if (direction === 'top' || direction === 'corner') {
                const deltaY = startY - e.clientY;
                this.height = Math.max(300, startHeight + deltaY);
            }

            this.cdr.detectChanges();
            this.scrollToBottom();
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    convertUrlsToLinks(text: string): string {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(
            urlRegex,
            url =>
                `<a href="${url}" target="_blank"
                   style="color:#E91E63;text-decoration:underline;">
                   ${url}
                 </a>`
        );
    }

    async checkServerAvailability(timeout = 3000): Promise<boolean> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sender: this.senderId, message: 'ping' }),
                signal: controller.signal
            });
            return response.ok;
        } catch {
            return false;
        } finally {
            clearTimeout(id);
        }
    }

    async resetChat(): Promise<void> {
        this.senderId = this.generateUUID();
        this.messages = [];
        this.activeButtons = null;
        this.scrollToBottom();
        this.cdr.detectChanges();

        this.showTyping();

        const available = await this.checkServerAvailability(3000);

        this.hideTyping();

        if (!available) {
            this.addMessage(
                this.currentLanguage === 'es'
                    ? 'En estos instantes no puedo atenderle, inténtelo de nuevo más tarde.'
                    : 'I cannot assist you right now. Please try again later.',
                'bot'
            );
            return;
        }

        this.showInitialMessage();
    }

    private async handleChangeBase(data: any): Promise<void> {
        const baseId = data?.base_id;
        if (!baseId) return;

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.currentProfileId = null;

                this.editJewelService.editBaseStructure(baseId);
                this.cdr.detectChanges();
            } catch (err) {
            }
        });
    }

    private async handleShowRing(data: any): Promise<void> {
        const ringType = data?.ring_type;
        const ringId = data?.ring_id;

        if (!ringType) return;

        try {
            const baseStructures = await this.editJewelService.getAllBaseStructures();

            const normalized = ringType
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();

            const match = baseStructures.find(bs => {
                const nameNormalized = bs.name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase();

                return nameNormalized === normalized;
            });

            if (!match) {
                return;
            }

            this.editJewelService.editBaseStructure(match._id);

            this.currentRingId = ringId;

        } catch (err) {
        }
    }

    private syncCurrentRing(): void {
        const currentJewel = this.editJewelService.jewel();
        this.currentRingId = currentJewel.baseStructure || null;
    }

    private async handleChangeVariante(data: any): Promise<void> {
        const varianteId = data?.variante_id;
        if (!varianteId) return;

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();
                this.editJewelService.editVariant(varianteId);
                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeMaterial(data: any): Promise<void> {
        const materialId = data?.material_id;
        if (!materialId) return;

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();
                this.editJewelService.editMaterial(materialId);
                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangePureza(data: any): Promise<void> {
        const materialId = data?.material_id;
        const purezaId = data?.pureza_id;

        if (!purezaId) return;

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                if (materialId) {
                    this.editJewelService.editMaterial(materialId);
                }

                this.editJewelService.editPurity(purezaId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeGema(data: any): Promise<void> {
        const gemaId = data?.gema_id;
        const gemPosition = data?.gem_position ?? 0;

        if (!gemaId) return;

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editGem(gemPosition, gemaId, false);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeFormaGema(data: any): Promise<void> {
        const formaGemaId = data?.forma_gema_id;
        let gemPosition = data?.gem_position;

        if (gemPosition === undefined || gemPosition === null) {
            gemPosition = 0;
        } else if (typeof gemPosition === 'string') {
            gemPosition = parseInt(gemPosition, 10);
        }

        if (!formaGemaId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editCut(gemPosition, formaGemaId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeEngaste(data: any): Promise<void> {
        const engasteId = data?.engaste_id;
        let gemPosition = data?.gem_position;

        if (gemPosition === undefined || gemPosition === null) {
            gemPosition = 0;
        } else if (typeof gemPosition === 'string') {
            gemPosition = parseInt(gemPosition, 10);
        }

        if (!engasteId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editSetting(gemPosition, engasteId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeClawNumber(data: any): Promise<void> {
        const numeroGarrasId = data?.numero_garras_id;
        let gemPosition = data?.gem_position;

        if (gemPosition === undefined || gemPosition === null) {
            gemPosition = 0;
        } else if (typeof gemPosition === 'string') {
            gemPosition = parseInt(gemPosition, 10);
        }

        if (!numeroGarrasId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editClawNumber(gemPosition, numeroGarrasId);

                this.cdr.detectChanges();
            } catch (err) { }
        });
    }

    private async handleChangeClawType(data: any): Promise<void> {
        const tipoGarrasId = data?.tipo_garras_id;
        let gemPosition = data?.gem_position;

        if (gemPosition === undefined || gemPosition === null) {
            gemPosition = 0;
        } else if (typeof gemPosition === 'string') {
            gemPosition = parseInt(gemPosition, 10);
        }

        if (!tipoGarrasId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editClawType(gemPosition, tipoGarrasId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeBoxShape(data: any): Promise<void> {
        const boxShapeId = data?.box_shape_id;

        if (!boxShapeId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editBoxShape(boxShapeId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeBoxOuterColor(data: any): Promise<void> {
        const boxOuterColorId = data?.box_outer_color_id;

        if (!boxOuterColorId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editBoxOuterColor(boxOuterColorId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeBoxInnerColor(data: any): Promise<void> {
        const boxInnerColorId = data?.box_inner_color_id;

        if (!boxInnerColorId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editBoxInnerColor(boxInnerColorId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeGemOrigin(data: any): Promise<void> {
        const gemOrigin = data?.gem_origin;
        let gemPosition = data?.gem_position;

        if (gemPosition === undefined || gemPosition === null) {
            gemPosition = 0;
        } else if (typeof gemPosition === 'string') {
            gemPosition = parseInt(gemPosition, 10);
        }

        if (!gemOrigin) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                const isSynthetic = gemOrigin === "lab_created";

                this.editJewelService.editIsSynthetic(gemPosition, isSynthetic);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private async handleChangeBoxComplete(data: any): Promise<void> {
        const boxShapeId = data?.box_shape_id;
        const boxOuterColorId = data?.box_outer_color_id;
        const boxInnerColorId = data?.box_inner_color_id;

        if (!boxShapeId || !boxOuterColorId || !boxInnerColorId) {
            return;
        }

        this.ngZone.run(async () => {
            try {
                await this.editJewelService.ensureCatalogs();

                this.editJewelService.editBoxShape(boxShapeId);
                this.editJewelService.editBoxOuterColor(boxOuterColorId);
                this.editJewelService.editBoxInnerColor(boxInnerColorId);

                this.cdr.detectChanges();
            } catch (err) {}
        });
    }

    private generateUUID(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}