import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { getAllDataForBackup, restoreData } from '../db/database';

export const exportBackup = async () => {
  try {
    const data = await getAllDataForBackup();
    if (data.length === 0) {
      Alert.alert('Bilgi', 'Yedeklenecek herhangi bir kayıt bulunamadı.');
      return;
    }

    const fileName = `Expense_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    
    // SDK 54 Nesne tabanlı File API:
    const file = new File(Paths.cache, fileName);
    if (!file.exists) {
      file.create();
    }
    file.write(JSON.stringify(data, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Harcama Yedeğini Dışa Aktar',
        UTI: 'public.json',
      });
    } else {
      Alert.alert('Hata', 'Paylaşım bu cihazda desteklenmiyor.');
    }
  } catch (error) {
    Alert.alert('Hata', 'Yedekleme sırasında bir sorun oluştu.');
  }
};

export const restoreBackupFromJson = async (jsonString) => {
  try {
    const parsedData = JSON.parse(jsonString);
    if (Array.isArray(parsedData)) {
      await restoreData(parsedData);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};