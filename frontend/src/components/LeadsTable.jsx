import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function LeadsTable() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLeads, setTotalLeads] = useState(0);
  const [sort, setSort] = useState("createdAt_desc");
  const [selectedLead, setSelectedLead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await axios.get("https://lead-management-dashboard-xi.vercel.app/api/leads/", {
          params: {
            search,
            stage,
            page: page + 1,
            limit: rowsPerPage,
            sort,
          },
        });
        setLeads(res.data.leads);
        setTotalLeads(res.data.total);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeads();
  }, [search, stage, page, rowsPerPage, sort]);

  const handleRowClick = (lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLead(null);
  };

  const stages = ["New", "Contacted", "Qualified", "Converted"];

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
        <h2 className="text-2xl font-bold mb-4">Leads</h2>

        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search by name"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Stage"
            variant="outlined"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Stages</MenuItem>
            {stages.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Sort by Date"
            variant="outlined"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="createdAt_desc">Newest First</MenuItem>
            <MenuItem value="createdAt_asc">Oldest First</MenuItem>
          </TextField>
        </Box>

        <TableContainer sx={{ maxHeight: 500, width: "100vw" }}>
          <Table stickyHeader aria-label="leads table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow
                  hover
                  key={lead._id}
                  onClick={() => handleRowClick(lead)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.stage}</TableCell>
                  <TableCell>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalLeads}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </Paper>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="lead-details-title"
        aria-describedby="lead-details-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}
        >
          {selectedLead && (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {Object.entries(selectedLead).map(([key, value]) => {
                  if (key === "_id" || key === "__v") return null;

                  if (key === "createdAt")
                    value = new Date(value).toLocaleDateString();

                  return (
                    <Typography key={key}>
                      <strong>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </strong>{" "}
                      {value}
                    </Typography>
                  );
                })}
              </Box>

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
