import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { showConfirm, showToast } from '../../components/AppLayout';
import { api } from '../../api';

export default function AirlinesTab() {
  const [airlines, setAirlines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAirline, setEditingAirline] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ ma_hang: '', ten_hang: '', quoc_gia: 'Vietnam', type: 'Full Service', status: 'active' });

  const fetchAirlines = async () => {
    setLoading(true);
    try {
      const data = await api.getAirlines();
      setAirlines(data);
    } catch {
      showToast('Không thể tải danh sách hãng hàng không', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAirlines(); }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingAirline(item);
      setFormData({ ma_hang: item.iata || item.id, ten_hang: item.name, quoc_gia: item.country || 'Vietnam', type: item.type || 'Full Service', status: item.status || 'active' });
    } else {
      setEditingAirline(null);
      setFormData({ ma_hang: '', ten_hang: '', quoc_gia: 'Vietnam', type: 'Full Service', status: 'active' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.ten_hang || !formData.ma_hang) {
      showToast('Vui lòng nhập đầy đủ Tên và Mã IATA', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingAirline) {
        await api.updateAirline(editingAirline.id, { ten_hang: formData.ten_hang, quoc_gia: formData.quoc_gia });
        showToast('Cập nhật thông tin hãng thành công!', 'success');
      } else {
        await api.createAirline({ ma_hang: formData.ma_hang.toUpperCase(), ten_hang: formData.ten_hang, quoc_gia: formData.quoc_gia });
        showToast('Đã thêm hãng hàng không mới!', 'success');
      }
      await fetchAirlines();
      setShowModal(false);
    } catch (e: any) {
      showToast(e.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm(`Bạn có chắc chắn muốn xóa hãng "${name}"?`, async () => {
      try {
        await api.deleteAirline(id);
        showToast('Đã xóa hãng hàng không thành công', 'success');
        await fetchAirlines();
      } catch {
        showToast('Không thể xóa hãng này (có thể đang được sử dụng)', 'error');
      }
    }, 'Xóa hãng hàng không');
  };

  return (
    <Card className="settings-card relative">
      <div className="card-header">
        <h3>Danh mục Hãng hàng không</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="outline" onClick={fetchAirlines}><span className="material-icons-round" style={{ fontSize: 16 }}>refresh</span></Button>
          <Button size="sm" onClick={() => handleOpenModal()}><span className="material-icons-round">add</span> Thêm hãng</Button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <span className="material-icons-round" style={{ fontSize: 40 }}>hourglass_top</span>
          <p style={{ marginTop: 8 }}>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="premium-table">
            <thead>
              <tr>
                <th>HÃNG BAY</th>
                <th>MÃ IATA</th>
                <th>QUỐC GIA</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              {airlines.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Chưa có dữ liệu</td></tr>
              ) : airlines.map(a => (
                <tr key={a.id}>
                  <td><b>{a.name}</b></td>
                  <td><code className="mono">{a.iata}</code></td>
                  <td>{a.country}</td>
                  <td>
                    <span className={`status-badge ${a.status === 'active' ? 'active' : 'inactive'}`}>
                      {a.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                    </span>
                  </td>
                  <td>
                    <div className="action-row">
                      <button className="icon-btn" onClick={() => handleOpenModal(a)}><span className="material-icons-round">edit</span></button>
                      <button className="icon-btn delete" onClick={() => handleDelete(a.id, a.name)}><span className="material-icons-round">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{editingAirline ? 'Sửa hãng hàng không' : 'Thêm hãng hàng không'}</h3>
            {!editingAirline && (
              <div className="form-group mt-md">
                <label>Mã IATA <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={formData.ma_hang} maxLength={10}
                  onChange={e => setFormData({ ...formData, ma_hang: e.target.value.toUpperCase() })}
                  className="input-field" placeholder="VD: VN, VJ, QH" />
              </div>
            )}
            <div className="form-group mt-md">
              <label>Tên hãng <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" value={formData.ten_hang}
                onChange={e => setFormData({ ...formData, ten_hang: e.target.value })}
                className="input-field" placeholder="VD: Vietnam Airlines" />
            </div>
            <div className="form-group mt-md">
              <label>Quốc gia</label>
              <input type="text" value={formData.quoc_gia}
                onChange={e => setFormData({ ...formData, quoc_gia: e.target.value })}
                className="input-field" />
            </div>
            <div className="modal-actions mt-lg">
              <Button variant="outline" onClick={() => setShowModal(false)}>Hủy</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
