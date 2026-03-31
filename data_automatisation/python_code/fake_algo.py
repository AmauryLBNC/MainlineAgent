
import pprint
import pandas as pd


df = pd.read_csv('fake_dataset_companies.csv')
df['chiffre_d_affaire']/=1e9
df['tresorerie']/=1e9
df['endettement_court_terme']/=1e9
df['endettement_long_terme']/=1e9
df['resultat_net']/=1e9



import tkinter as tk


def compteur22(input):
    if input<2:
        return input+1
    else :
        return -2 
def cliquer():
    print("Bouton cliquer")
def clear_root(root):
    for widget in root.winfo_children():
        widget.destroy()
import tkinter as tk
import os
import pandas as pd
import tkinter as tk

def critere_page(root):
    header(root)

    frame_critere_page = tk.Frame(root)
    frame_critere_page.pack(fill='both', expand=True, pady=20)

    # Important: donne de la place aux dropdowns
    for c in range(5):
        frame_critere_page.grid_columnconfigure(c, weight=1)

    tab_entry = []
    tab_influence = []

    # Champs proposés = colonnes du df (souvent on exclut nom_entreprise)
    choices = [c for c in df.columns if c != "nom_entreprise"]

    # ---- 5 AUTOCOMPLETE (ligne 0)
    # On crée une "cellule" (Frame) par colonne pour que la listbox s'affiche dessous
    cell_frames = []
    for i in range(5):
        cell = tk.Frame(frame_critere_page)
        cell.grid(row=0, column=i, padx=10, pady=5, sticky="n")
        cell_frames.append(cell)

        entry_widget, var, listbox = make_autocomplete(cell, choices, width=18)
        tab_entry.append(entry_widget)

    # ---- 5 BOUTONS influence (ligne 1)
    def compteur_influence(idx):
        tab_influence[idx][0] = compteur22(tab_influence[idx][0])
        tab_influence[idx][1].config(text=str(tab_influence[idx][0]))

    for i in range(5):
        tab_influence.append([0, None])
        b = tk.Button(
            frame_critere_page, bg='black', fg='white', text="0",
            command=lambda idx=i: compteur_influence(idx)
        )
        b.grid(row=1, column=i, padx=10, pady=5)
        tab_influence[i][1] = b

    # ---- 6e bouton SCORE
    score = [0, None]
    def compteur_score():
        score[0] = compteur22(score[0])
        score[1].config(text=f"Score: {score[0]}")

    score_btn = tk.Button(frame_critere_page, bg="darkblue", fg="white",
                          text=f"Score: {score[0]}", command=compteur_score)
    score_btn.grid(row=2, column=0, columnspan=2, pady=10, sticky="w")
    score[1] = score_btn

    # ---- Sauvegarde CSV selon tes règles
    def gestion(df, tab_entry, tab_influence, score, filename="contrainte.csv"):
        colonnes_valides = set(df.columns)

        contraintes_valides = []
        for e, (infl, _) in zip(tab_entry, tab_influence):
            critere = e.get().strip()
            if not critere:
                continue
            if critere in colonnes_valides:
                contraintes_valides.append((critere, infl))

        if len(contraintes_valides) < 2:
            print("Pas assez de critères valides (<2) -> aucune ligne ajoutée")
            return

        while len(contraintes_valides) < 5:
            contraintes_valides.append((0, 0))

        row = {}
        for k in range(5):
            row[f"critere{k+1}"] = contraintes_valides[k][0]
            row[f"influence{k+1}"] = contraintes_valides[k][1]
        row["score"] = score[0]

        df_out = pd.DataFrame([row])
        file_exists = os.path.exists(filename)
        df_out.to_csv(filename, index=False, mode="a", header=not file_exists)
        print("Ligne ajoutée:", row)

    bouton_add_constraint = tk.Button(
        root, text='Add', bg='black', fg='white',
        command=lambda: gestion(df, tab_entry, tab_influence, score)
    )
    bouton_add_constraint.pack(pady=15)
def make_autocomplete(parent, choices, width=30):
    """
    parent: frame où placer l'Entry + Listbox
    choices: liste de strings (ex: list(df.columns))
    """
    choices = sorted(set(map(str, choices)))

    var = tk.StringVar()
    entry = tk.Entry(parent, textvariable=var, width=width)
    entry.grid(row=0, column=0, sticky="ew")

    listbox = tk.Listbox(parent, height=6, width=width)
    listbox.grid(row=1, column=0, sticky="ew")
    listbox.grid_remove()  # caché au début

    def update_suggestions(*_):
        text = var.get().strip().lower()
        listbox.delete(0, tk.END)

        if not text:
            listbox.grid_remove()
            return

        matches = [c for c in choices if c.lower().startswith(text)]
        if not matches:
            listbox.grid_remove()
            return

        for m in matches[:20]:  # limite à 20 suggestions
            listbox.insert(tk.END, m)

        listbox.grid()

    def choose_selected(_=None):
        if listbox.size() == 0:
            return
        sel = listbox.curselection()
        if not sel:
            # si rien sélectionné, prendre le premier
            value = listbox.get(0)
        else:
            value = listbox.get(sel[0])
        var.set(value)
        listbox.grid_remove()
        entry.icursor(tk.END)
        entry.focus_set()

    # Mise à jour à chaque frappe
    var.trace_add("write", update_suggestions)

    # Choix via clic ou Entrée
    listbox.bind("<ButtonRelease-1>", choose_selected)
    listbox.bind("<Return>", choose_selected)

    # Naviguer au clavier
    def on_down(_):
        if listbox.winfo_ismapped() and listbox.size() > 0:
            listbox.focus_set()
            listbox.selection_clear(0, tk.END)
            listbox.selection_set(0)
            listbox.activate(0)

    entry.bind("<Down>", on_down)
    entry.bind("<Return>", lambda e: choose_selected())

    # Cache les suggestions si on clique ailleurs / escape
    entry.bind("<Escape>", lambda e: listbox.grid_remove())

    return entry, var, listbox

def header(root):
    frame_header=tk.Frame(root,height=60,bg='black')
    frame_header.pack(fill='x')
    def Return (root):
        clear_root(root)
        search_page(root)
    def critere (root):
        clear_root(root)
        critere_page(root)
    def leave(root):
        clear_root(root)
        root.destroy()
    return_button = tk.Button(frame_header,text='Return',bg='white',command = lambda : Return(root)).grid(row=0,column=0,padx=10)
    add_contraint_button = tk.Button(frame_header,text='critere',bg='white',command=lambda :critere(root)).grid(row=0,column=1,padx=10)
    leave_button=tk.Button(frame_header,text='Quitter',command= lambda :leave(root)).grid(row=0,column=2,padx=10)



def add_frame (df,column,root):
    header(root)
    frame=tk.Frame(root)
    frame.pack(fill='both',expand=True)
    
    

    scrollbar = tk.Scrollbar(frame)
    scrollbar.pack(side='right',fill="y")

    listbox = tk.Listbox(frame,yscrollcommand=scrollbar.set)
    listbox.pack(side="left",fill="both",expand=True)

    scrollbar.config(command=listbox.yview)

    for i,a in enumerate(df.columns[1:]):
        string=f"{a} : {round(df.iloc[column][i+2],3)}"
        listbox.insert(tk.END,string)



def Configuration_page():
    root = tk.Tk()
    root.title("Ma premiere app")
    root.geometry("900x600")
    root.configure(bg='lightblue')
    return root

def search_page(root):
    header(root)
    entry = tk.Entry(root)
    entry.pack(pady=10)

    def on_enter(event):
        nom_entreprise = entry.get()
        if nom_entreprise in df['nom_entreprise'].tolist():
            clear_root(root)
            index = df['nom_entreprise'].tolist().index(nom_entreprise)
            add_frame(df, index, root)

    entry.bind("<Return>", on_enter)

def main():
    root = Configuration_page()
    search_page(root)
    root.mainloop()
main()