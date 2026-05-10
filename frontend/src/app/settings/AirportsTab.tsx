import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function AirportsTab({ onToast }: { onToast?: (msg: string, type?: 'success'|'error') => void }) {
  const [airports, setAirports] = useState([
    { id: 'SGN', name: 'Tân Sơn Nhất', code: 'SGN', city: 'Hồ Chí Minh', country: 'Vietnam', terminals: 'T1, T2', status: 'active' },
    { id: 'HAN', name: 'Nội Bài', code: 'HAN', city: 'Hà Nội', country: 'Vietnam', terminals: 'T1, T2', status: 'active' },
    { id: 'DAD', name: 'Đà Nẵng', code: 'DAD', city: 'Đà Nẵng', country: 'Vietnam', terminals: 'T1', status: 'active' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingAirport, setEditingAirport] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', code: '', city: '', country: 'Vietnam', terminals: '', status: 'active' });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingAirport(item);
      setFormData(item);
    } else {
      setEditingAirport(null);
      setFormData({ name: '', code: '', city: '', country: 'Vietnam', terminals: '', status: 'active' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      onToast?.('Vui lòng nhập Tên và Mã sân bay', 'error');
      return;
    }
    if (editingAirport) {
      setAirports(airports.map(a => a.id === editingAirport.id ? { ...formData, id: a.id } : a));
      onToast?.('Cập nhật thông tin sân bay thành công!', 'success');
    } else {
      setAirports([...airports, { ...formData, id: formData.code }]);
      onToast?.('Đã thêm sân bay mới!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sân bay này?')) {
      setAirports(airports.filter(a => a.id !== id));
      onToast?.('Đã xóa sân bay thành công', 'success');
    }
  };

  return (
    <Card className="settings-card relative">
      <div className="card-header">
        <h3>Danh mục Sân bay & Nhà ga</h3>
        <Button size="sm" onClick={() => handleOpenModal()}><span className="material-icons-round">add</span> Thêm sân bay</Button>
      </div>
      <div className="table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>SÂN BAY</th>
              <th>MÃ IATA</th>
              <th>THÀNH PHỐ</th>
              <th>NHÀ GA (TERMINALS)</th>
              <th>TRẠNG THÁI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {airports.map(a => (
              <tr key={a.id}>
                <td><b>{a.name}</b></td>
                <td><code className="mono">{a.code}</code></td>
                <td>{a.city}</td>
                <td>{a.terminals}</td>
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
            <h3>{editingAirport ? 'Sửa sân bay' : 'Thêm sân bay'}</h3>
            <div className="form-group mt-md">
              <label>Tên sân bay</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="VD: Tân Sơn Nhất" />
            </div>
            <div className="form-group mt-md">
              <label>Mã IATA</label>
              <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="input-field" placeholder="VD: SGN" />
            </div>
            <div className="form-group mt-md">
              <label>Thành phố</label>
              <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="input-field" placeholder="VD: Hồ Chí Minh" />
            </div>
            <div className="form-group mt-md">
              <label>Nhà ga (cách nhau bởi dấu phẩy)</label>
              <input type="text" value={formData.terminals} onChange={e => setFormData({...formData, terminals: e.target.value})} className="input-field" placeholder="VD: T1, T2" />
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
