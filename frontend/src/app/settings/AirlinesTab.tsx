import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function AirlinesTab({ onToast }: { onToast?: (msg: string, type?: 'success'|'error') => void }) {
  const [airlines, setAirlines] = useState([
    { id: 'VN', name: 'Vietnam Airlines', iata: 'VN', type: 'Full Service', country: 'Vietnam', status: 'active' },
    { id: 'VJ', name: 'VietJet Air', iata: 'VJ', type: 'Low Cost', country: 'Vietnam', status: 'active' },
    { id: 'QH', name: 'Bamboo Airways', iata: 'QH', type: 'Hybrid', country: 'Vietnam', status: 'active' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingAirline, setEditingAirline] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', iata: '', type: 'Full Service', country: 'Vietnam', status: 'active' });

  const handleOpenModal = (airline?: any) => {
    if (airline) {
      setEditingAirline(airline);
      setFormData(airline);
    } else {
      setEditingAirline(null);
      setFormData({ name: '', iata: '', type: 'Full Service', country: 'Vietnam', status: 'active' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.iata) {
      onToast?.('Vui lòng nhập đầy đủ Tên và Mã IATA', 'error');
      return;
    }
    if (editingAirline) {
      setAirlines(airlines.map(a => a.id === editingAirline.id ? { ...formData, id: a.id } : a));
      onToast?.('Cập nhật thông tin hãng thành công!', 'success');
    } else {
      setAirlines([...airlines, { ...formData, id: formData.iata }]);
      onToast?.('Đã thêm hãng hàng không mới!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hãng này?')) {
      setAirlines(airlines.filter(a => a.id !== id));
      onToast?.('Đã xóa hãng hàng không', 'success');
    }
  };

  return (
    <Card className="settings-card relative">
      <div className="card-header">
        <h3>Danh mục Hãng hàng không</h3>
        <Button size="sm" onClick={() => handleOpenModal()}><span className="material-icons-round">add</span> Thêm hãng</Button>
      </div>
      <div className="table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>HÃNG BAY</th>
              <th>IATA</th>
              <th>PHÂN LOẠI</th>
              <th>QUỐC GIA</th>
              <th>TRẠNG THÁI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {airlines.map(a => (
              <tr key={a.id}>
                <td><b>{a.name}</b></td>
                <td><code className="mono">{a.iata}</code></td>
                <td>{a.type}</td>
                <td>{a.country}</td>
                <td>
                  <span className={`status-badge ${a.status === 'active' ? 'active' : 'inactive'}`}>
                    {a.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </span>
                </td>
                <td>
                  <div className="action-row">
                    <button className="icon-btn" onClick={() => handleOpenModal(a)}><span className="material-icons-round">edit</span></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(a.id)}><span className="material-icons-round">delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{editingAirline ? 'Sửa hãng hàng không' : 'Thêm hãng hàng không'}</h3>
            <div className="form-group mt-md">
              <label>Tên hãng</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="VD: Vietnam Airlines" />
            </div>
            <div className="form-group mt-md">
              <label>Mã IATA</label>
              <input type="text" value={formData.iata} onChange={e => setFormData({...formData, iata: e.target.value})} className="input-field" placeholder="VD: VN" />
            </div>
            <div className="form-group mt-md">
              <label>Phân loại</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-field">
                <option value="Full Service">Full Service</option>
                <option value="Low Cost">Low Cost</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="form-group mt-md">
              <label>Quốc gia</label>
              <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="input-field" />
            </div>
            <div className="form-group mt-md">
              <label>Trạng thái</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-field">
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>
            <div className="modal-actions mt-lg">
              <Button variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button onClick={handleSave}>Lưu thay đổi</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
