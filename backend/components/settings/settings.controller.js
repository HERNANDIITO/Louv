import * as SettingService from './settings.service.js';

export const getSettings = async (req, res) => {
    const settings = await SettingService.findSettings({ query: req.query });
    res.status(200).json({ result: 'OK', settings });
};

export const getSettingById = async (req, res) => {
    const setting = await SettingService.findSettingById({ settingId: req.params.settingId });
    res.status(200).json({ result: 'OK', setting });
};

export const postSetting = async (req, res) => {
    const setting = await SettingService.createSetting({ settingData: req.body });
    res.status(201).json({ result: 'OK', setting });
};

export const updateSettingById = async (req, res) => {
    const setting = await SettingService.updateSettingById({
        settingId: req.params.settingId,
        settingUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', setting });
};

export const deleteSettingById = async (req, res) => {
    await SettingService.deleteSettingById({ settingId: req.params.settingId });
    res.status(204).end();
};
