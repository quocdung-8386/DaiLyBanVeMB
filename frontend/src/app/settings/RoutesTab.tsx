import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function RoutesTab({ onToast }: { onToast?: (msg: string, type?: 'success'|'error') => void }) {
  const [routes, setRoutes] = useState([
    { id: '1', from: 'SGN', to: 'HAN', type: 'Nội địa', distance: '1,190 km', duration: '2h 10m', status: 'active' },
    { id: '2', from: 'SGN', to: 'DAD', type: 'Nội địa', distance: '600 km', duration: '1h 20m', status: 'active' },
    { id: '3', from: 'HAN', to: 'ICN', type: 'Quốc tế', distance: '2,740 km', duration: '4h 30m', status: 'active' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);
  const [formData, setFormData] = useState({ from: '', to: '', type: 'Nội địa', distance: '', duration: '', status: 'active' });

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingRoute(item);
      setFormData(item);
    } else {
      setEditingRoute(null);
      setFormData({ from: '', to: '', type: 'Nội địa', distance: '', duration: '', status: 'active' });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.from || !formData.to) {
      onToast?.('Vui lòng nhập đầy đủ Điểm đi và Điểm đến', 'error');
      return;
    }
    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...formData, id: r.id } : r));
      onToast?.('Cập nhật tuyến bay thành công!', 'success');
    } else {
      setRoutes([...routes, { ...formData, id: Date.now().toString() }]);
      onToast?.('Đã thêm tuyến bay mới!', 'success');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tuyến bay này?')) {
      setRoutes(routes.filter(r => r.id !== id));
      onToast?.('Đã xóa tuyến bay thành công', 'success');
    }
  };

  return (
    <Card className="settings-card relative">
      <div className="card-header">
        <h3>Tuyến bay khai thác</h3>
        <Button size="sm" onClick={() => handleOpenModal()}><span className="material-icons-round">add</span> Thêm tuyến bay</Button>
      </div>
      <div className="table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>ĐIỂM ĐI</th>
              <th>ĐIỂM ĐẾN</th>
              <th>PHÂN LOẠI</th>
              <th>KHOẢNG CÁCH</th>
              <th>THỜI GIAN BAY</th>
              <th>TRẠNG THÁI</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(r => (
              <tr key={r.id}>
                <td><code className="mono">{r.from}</code></td>
                <td><code className="mono">{r.to}</code></td>
                <td>{r.type}</td>
                <td>{r.distance}</td>
                <td>{r.duration}</td>
                <td>
                  <span className={`status-badge ${r.status === 'active' ? 'active' : 'inactive'}`}>
                    {r.status === 'active' ? 'Khai thác' : 'Ngừng khai thác'}
                  </span>
                </td>
                <td>
                  <div className="action-row">
                    <button className="icon-btn" onClick={() => handleOpenModal(r)}><span className="material-icons-round">edit</span></button>
                    <button className="icon-btn delete" onClick={() => handleDelete(r.id)}><span className="material-icons-round">delete</span></button>
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
            <h3>{editingRoute ? 'Sửa tuyến bay' : 'Thêm tuyến bay'}</h3>
            <div className="form-group-row mt-md">
              <div className="form-group">
                <label>Mã Sân bay Đi (IATA)</label>
                <input type="text" value={formData.from} onChange={e => setFormData({...formData, from: e.target.value.toUpperCase()})} className="input-field" placeholder="VD: SGN" />
              </div>
              <div className="form-group">
                <label>Mã Sân bay Đến (IATA)</label>
                <input type="text" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value.toUpperCase()})} className="input-field" placeholder="VD: HAN" />
              </div>
            </div>
            <div className="form-group mt-md">
              <label>Phân loại</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="input-field">
                <option value="Nội địa">Nội địa</option>
                <option value="Quốc tế">Quốc tế</option>
              </select>
            </div>
            <div className="form-group-row mt-md">
              <div className="form-group">
                <label>Khoảng cách</label>
                <input type="text" value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} className="input-field" placeholder="VD: 1,190 km" />
              </div>
              <div className="form-group">
                <label>Thời gian bay dự kiến</label>
                <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="input-field" placeholder="VD: 2h 10m" />
              </div>
            </div>
            <div className="form-group mt-md">
              <label>Trạng thái</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-field">
                <option value="active">Khai thác</option>
                <option value="inactive">Ngừng khai thác</option>
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
