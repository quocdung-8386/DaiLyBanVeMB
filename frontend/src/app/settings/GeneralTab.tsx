import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function GeneralTab({ onToast }: { onToast?: (msg: string, type?: 'success'|'error') => void }) {
  const [settings, setSettings] = useState({
    agencyName: 'Skyward Portal Travel',
    contactEmail: 'contact@skyward.vn',
    supportPhone: '1900 6868',
    address: '123 Nguyễn Văn Linh, Đà Nẵng',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh',
    maintenanceMode: false,
    autoCancelHold: true,
  });

  const handleSave = () => {
    onToast?.('Đã lưu thành công Cài đặt Chung!', 'success');
  };

  return (
    <div className="general-settings">
      <Card className="settings-card relative">
        <div className="card-header">
          <h3>Cài đặt Hệ thống</h3>
        </div>
        <p className="description" style={{ marginTop: '-16px', marginBottom: '24px' }}>Cấu hình thông tin đại lý và các tham số vận hành chung.</p>
        
        <div className="config-grid">
          <div className="form-group">
            <label>Tên Đại lý / Thương hiệu</label>
            <input type="text" className="input-field" value={settings.agencyName} onChange={e => setSettings({...settings, agencyName: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email liên hệ</label>
            <input type="email" className="input-field" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Hotline hỗ trợ</label>
            <input type="text" className="input-field" value={settings.supportPhone} onChange={e => setSettings({...settings, supportPhone: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Tiền tệ mặc định</label>
            <select className="input-field" value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})}>
              <option value="VND">VNĐ - Việt Nam Đồng</option>
              <option value="USD">USD - Đô la Mỹ</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Địa chỉ văn phòng</label>
            <input type="text" className="input-field" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
          </div>
        </div>

        <div className="divider mt-lg mb-lg"></div>

        <h3>Tính năng tự động</h3>
        <div className="auto-settings-list mt-md">
          <div className="auto-setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <b style={{ color: '#1e293b', fontSize: '14px' }}>Bảo trì hệ thống</b>
              <p className="description">Tạm thời khóa truy cập đối với khách hàng để cập nhật hệ thống.</p>
            </div>
            <div className={`toggle ${settings.maintenanceMode ? 'active' : ''}`} onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}></div>
          </div>
          <div className="auto-setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
            <div>
              <b style={{ color: '#1e293b', fontSize: '14px' }}>Tự động hủy vé quá hạn (Hold)</b>
              <p className="description">Hệ thống sẽ tự động chuyển trạng thái PNR thành Canceled nếu quá hạn thanh toán.</p>
            </div>
            <div className={`toggle ${settings.autoCancelHold ? 'active' : ''}`} onClick={() => setSettings({...settings, autoCancelHold: !settings.autoCancelHold})}></div>
          </div>
        </div>

        <Button className="mt-lg" onClick={handleSave}>Lưu Cài đặt Chung</Button>
      </Card>
    </div>
  );
}
