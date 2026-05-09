import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function MarkupTab({ onToast }: { onToast?: (msg: string, type?: 'success'|'error') => void }) {
  const [markupData, setMarkupData] = useState({
    domestic: 50000,
    international: 150000,
    vat: 10,
    classes: [
      { id: '1', name: 'Economy', amount: 50000, status: true },
      { id: '2', name: 'Business', amount: 200000, status: true },
      { id: '3', name: 'First Class', amount: 500000, status: false },
    ]
  });

  const handleUpdateConfig = () => {
    onToast?.('Cấu hình Markup & Thuế đã được lưu thành công!', 'success');
  };

  const toggleClassStatus = (id: string) => {
    setMarkupData({
      ...markupData,
      classes: markupData.classes.map(c => c.id === id ? { ...c, status: !c.status } : c)
    });
  };

  const handleAmountChange = (id: string, amount: number) => {
    setMarkupData({
      ...markupData,
      classes: markupData.classes.map(c => c.id === id ? { ...c, amount } : c)
    });
  };

  return (
    <div className="markup-settings">
      <Card className="settings-card relative">
        <h3>Cấu hình Markup (Lợi nhuận đại lý)</h3>
        <p className="description">Thiết lập mức phí dịch vụ cộng thêm vào giá vé của hãng.</p>
        
        <div className="config-grid">
          <div className="config-item">
            <label>Markup mặc định (Nội địa)</label>
            <div className="input-group">
              <input type="number" value={markupData.domestic} onChange={e => setMarkupData({...markupData, domestic: parseInt(e.target.value) || 0})} />
              <span>VNĐ / khách</span>
            </div>
          </div>
          <div className="config-item">
            <label>Markup mặc định (Quốc tế)</label>
            <div className="input-group">
              <input type="number" value={markupData.international} onChange={e => setMarkupData({...markupData, international: parseInt(e.target.value) || 0})} />
              <span>VNĐ / khách</span>
            </div>
          </div>
          <div className="config-item">
            <label>Thuế VAT (%)</label>
            <div className="input-group">
              <input type="number" value={markupData.vat} onChange={e => setMarkupData({...markupData, vat: parseInt(e.target.value) || 0})} />
              <span>%</span>
            </div>
          </div>
        </div>
        <Button className="mt-lg" onClick={handleUpdateConfig}>Cập nhật cấu hình</Button>
      </Card>

      <Card className="settings-card mt-lg relative">
        <div className="card-header">
          <h3>Markup theo hạng vé</h3>
        </div>
        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <th>HẠNG VÉ</th>
                <th>MỨC CỘNG THÊM (VNĐ)</th>
                <th>TRẠNG THÁI ÁP DỤNG</th>
              </tr>
            </thead>
            <tbody>
              {markupData.classes.map(c => (
                <tr key={c.id}>
                  <td><b>{c.name}</b></td>
                  <td>
                    <input 
                      type="number" 
                      className="inline-input" 
                      style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', width: '150px' }}
                      value={c.amount} 
                      onChange={e => handleAmountChange(c.id, parseInt(e.target.value) || 0)} 
                    />
                  </td>
                  <td>
                    <div className={`toggle ${c.status ? 'active' : ''}`} onClick={() => toggleClassStatus(c.id)}></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
