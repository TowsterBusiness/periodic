import elementFile from "./assets/periodic_elements.json";
import moleculeFile from "./assets/molecules/1,1_difluoroethene.json";

export type ElementJson = (typeof elementFile.elements)[0];
export type MoleculeJson = typeof moleculeFile;
